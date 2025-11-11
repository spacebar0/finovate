
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function RocketGraphic() {
  const imageData = PlaceHolderImages.find(img => img.id === 'onboarding-goal');

  if (!imageData) return null;

  return (
    <Image
      src={imageData.imageUrl}
      alt={imageData.description}
      width={180}
      height={220}
      className="w-1/2 h-auto"
      data-ai-hint={imageData.imageHint}
    />
  );
}
