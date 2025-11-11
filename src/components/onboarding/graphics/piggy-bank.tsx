
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function PiggyBankGraphic() {
  const imageData = PlaceHolderImages.find(img => img.id === 'onboarding-coins');

  if (!imageData) return null;

  return (
    <Image
      src={imageData.imageUrl}
      alt={imageData.description}
      width={200}
      height={180}
      className="w-40 h-auto md:w-52"
      data-ai-hint={imageData.imageHint}
    />
  );
}
