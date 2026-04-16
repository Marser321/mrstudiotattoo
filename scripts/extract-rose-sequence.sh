#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FFMPEG_STATIC_DIR="$ROOT_DIR/node_modules/ffmpeg-static"

INPUT_VIDEO="${INPUT_VIDEO:-/Users/mariomorera/Desktop/mr tato/SaveClip.App_AQOo6IrTtnTSz8iGA5brXvyHt6xYw3Nz7_rsanZdJ0sSfyVQ5kAc0dSYYGJLrMXKgBiZ0n1LHj1pNM298SBwaoEoGbs1VsEYxU4GtHc.mp4}"
OUTPUT_DIR="${OUTPUT_DIR:-$ROOT_DIR/public/assets/rose-sequence-v1}"
FRAME_COUNT="${FRAME_COUNT:-150}"
SQUARE_SIZE="${SQUARE_SIZE:-1024}"
WEBP_QUALITY="${WEBP_QUALITY:-82}"

FFMPEG_BIN="${FFMPEG_BIN:-}"

resolve_ffmpeg_bin() {
  if [[ -n "$FFMPEG_BIN" && -x "$FFMPEG_BIN" ]]; then
    echo "$FFMPEG_BIN"
    return
  fi

  if command -v ffmpeg >/dev/null 2>&1; then
    command -v ffmpeg
    return
  fi

  if [[ -x "$FFMPEG_STATIC_DIR/ffmpeg" ]]; then
    echo "$FFMPEG_STATIC_DIR/ffmpeg"
    return
  fi

  local node_ffmpeg
  node_ffmpeg="$(cd "$ROOT_DIR" && node -e "const p=require('ffmpeg-static'); process.stdout.write(p || '')" 2>/dev/null || true)"
  if [[ -n "$node_ffmpeg" && -x "$node_ffmpeg" ]]; then
    echo "$node_ffmpeg"
    return
  fi

  if [[ -f "$FFMPEG_STATIC_DIR/install.js" ]]; then
    echo "ffmpeg bin not found yet. Bootstrapping ffmpeg-static binary..." >&2
    (cd "$ROOT_DIR" && node node_modules/ffmpeg-static/install.js)
    if [[ -x "$FFMPEG_STATIC_DIR/ffmpeg" ]]; then
      echo "$FFMPEG_STATIC_DIR/ffmpeg"
      return
    fi
  fi

  echo "Error: ffmpeg executable not found. Install ffmpeg or run: pnpm add -D ffmpeg-static" >&2
  exit 1
}

get_duration_seconds() {
  local input="$1"
  local ffmpeg_bin="$2"

  if command -v ffprobe >/dev/null 2>&1; then
    ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$input" 2>/dev/null || true
    return
  fi

  if command -v mdls >/dev/null 2>&1; then
    mdls "$input" 2>/dev/null | awk -F'=' '/kMDItemDurationSeconds/{gsub(/^[ \t]+|[ \t]+$/, "", $2); print $2; exit}' || true
    return
  fi

  "$ffmpeg_bin" -i "$input" 2>&1 | awk -F'Duration: ' '/Duration:/{print $2; exit}' | awk -F',' '{print $1}' | awk -F':' '{printf "%.6f\n", ($1*3600)+($2*60)+$3}' || true
}

assert_prerequisites() {
  if [[ ! -f "$INPUT_VIDEO" ]]; then
    echo "Error: input video not found at: $INPUT_VIDEO" >&2
    exit 1
  fi

  if [[ ! "$FRAME_COUNT" =~ ^[0-9]+$ ]] || [[ "$FRAME_COUNT" -lt 2 ]]; then
    echo "Error: FRAME_COUNT must be an integer >= 2 (got: $FRAME_COUNT)" >&2
    exit 1
  fi
}

main() {
  assert_prerequisites

  local ffmpeg_bin
  ffmpeg_bin="$(resolve_ffmpeg_bin)"

  local duration
  duration="$(get_duration_seconds "$INPUT_VIDEO" "$ffmpeg_bin")"
  if [[ -z "$duration" ]]; then
    echo "Error: could not determine video duration for: $INPUT_VIDEO" >&2
    exit 1
  fi

  local fps
  fps="$(awk -v count="$FRAME_COUNT" -v duration="$duration" 'BEGIN { printf "%.10f", count / duration }')"

  local tmp_dir
  tmp_dir="$(mktemp -d "${OUTPUT_DIR}.tmp.XXXXXX")"
  trap 'rm -rf "$tmp_dir"' EXIT

  mkdir -p "$tmp_dir"

  echo "Extracting $FRAME_COUNT rose frames from:"
  echo "  $INPUT_VIDEO"
  echo "Output directory:"
  echo "  $OUTPUT_DIR"
  echo "Computed duration: $duration s | sampling fps: $fps"

  "$ffmpeg_bin" -y -hide_banner -loglevel error -i "$INPUT_VIDEO" \
    -vf "fps=${fps},crop='min(iw,ih)':'min(iw,ih)',scale=${SQUARE_SIZE}:${SQUARE_SIZE}:flags=lanczos,format=rgba" \
    -frames:v "$FRAME_COUNT" \
    -c:v libwebp -quality "$WEBP_QUALITY" -compression_level 6 -preset photo \
    "$tmp_dir/frame_%04d.webp"

  local generated_count
  generated_count="$(find "$tmp_dir" -type f -name 'frame_*.webp' | wc -l | tr -d ' ')"

  if [[ "$generated_count" -lt "$FRAME_COUNT" ]]; then
    local last_frame
    last_frame="$(printf "%s/frame_%04d.webp" "$tmp_dir" "$generated_count")"
    if [[ ! -f "$last_frame" ]]; then
      echo "Error: could not find last generated frame ($last_frame) for padding" >&2
      exit 1
    fi

    local i
    for ((i = generated_count + 1; i <= FRAME_COUNT; i++)); do
      cp "$last_frame" "$(printf "%s/frame_%04d.webp" "$tmp_dir" "$i")"
    done
    generated_count="$FRAME_COUNT"
  elif [[ "$generated_count" -gt "$FRAME_COUNT" ]]; then
    find "$tmp_dir" -type f -name 'frame_*.webp' | sort | tail -n +"$((FRAME_COUNT + 1))" | xargs -I{} rm -f "{}"
    generated_count="$FRAME_COUNT"
  fi

  rm -rf "$OUTPUT_DIR"
  mkdir -p "$OUTPUT_DIR"
  mv "$tmp_dir"/frame_*.webp "$OUTPUT_DIR"/

  trap - EXIT
  rm -rf "$tmp_dir"

  echo "Done. Generated $generated_count frames in $OUTPUT_DIR"
}

main "$@"
