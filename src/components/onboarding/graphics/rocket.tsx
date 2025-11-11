
import Image from 'next/image';

export function RocketGraphic() {
  return (
    <Image
      src="/images/illustration-2.svg"
      alt="Horse illustration"
      width={180}
      height={220}
      className="w-1/2 h-auto"
    />
  );
}
