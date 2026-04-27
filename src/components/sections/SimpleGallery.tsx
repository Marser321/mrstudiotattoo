

const galleryImages = [
  '/assets/mr-studio-tattoo/photos/gallery_1.jpg',
  '/assets/mr-studio-tattoo/photos/gallery_2.jpg',
  '/assets/mr-studio-tattoo/photos/gallery_3.jpg',
  '/assets/mr-studio-tattoo/photos/gallery_4.jpg',
  '/assets/mr-studio-tattoo/photos/gallery_5.jpg',
  '/assets/mr-studio-tattoo/photos/gallery_6.jpg',
];

export function SimpleGallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-8 bg-background">
      {galleryImages.map((src, index) => (
        <div 
          key={index} 
          className="relative aspect-square overflow-hidden border border-border group hover:border-red-600/50 transition-all duration-700"
        >
          <img 
            src={src} 
            alt={`Work ${index + 1}`} 
            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-foreground/10 group-hover:bg-transparent transition-colors duration-700" />
        </div>
      ))}
    </div>
  );
}
