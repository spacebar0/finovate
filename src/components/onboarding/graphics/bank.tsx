
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function BankGraphic() {
  const imageData = PlaceHolderImages.find(img => img.id === 'onboarding-bank');

  if (!imageData) return null;

  return (
    <Image
      src={imageData.imageUrl}
      alt={imageData.description}
      width={270}
      height={235}
      className="w-2/3 h-auto"
      priority
      data-ai-hint={imageData.imageHint}
    />
  );
}
