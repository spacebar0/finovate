'use client';

import { StepLayout } from './base-step';
import { OnboardingNavigation } from '../navigation';
import { Button } from '@/components/ui/button';
import { OnboardingProgress } from '../progress';
import { Apple, CreditCard } from 'lucide-react';

interface PaymentLinkStepProps {
  goNext: () => void;
  goPrev: () => void;
  currentStep: number;
  totalSteps: number;
}

const GPayIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.1812 10.0574H15.0182V12.1465H10.1812V10.0574Z" fill="white"/>
        <path d="M19.3496 10.3908C19.3496 9.6385 19.2882 8.92556 19.1867 8.24304H9.72852V10.669H15.1118C14.9392 11.5544 14.2887 12.6366 13.0645 13.4347L13.0536 13.4984L15.3495 15.2285L15.452 15.221C17.9547 13.0039 19.3496 11.2339 19.3496 10.3908Z" fill="white"/>
        <path d="M9.72852 16.0001C11.637 16.0001 13.2036 15.3605 14.3946 14.3754L12.0299 12.721C11.3702 13.1558 10.6121 13.4984 9.72852 13.4984C7.94073 13.4984 6.44426 12.3339 5.95251 10.8872L5.875 10.8981L3.48785 12.6074L3.42773 12.7265C4.60786 14.7393 6.96162 16.0001 9.72852 16.0001Z" fill="white"/>
        <path d="M5.93896 8.35824C5.70249 7.78136 5.56818 7.15579 5.56818 6.50009C5.56818 5.84439 5.70249 5.21882 5.93896 4.64194L5.93442 4.56857L3.52686 2.84619L3.45459 2.92386C2.58045 4.54227 2.06818 6.50009 2.06818 8.49479C2.06818 10.4895 2.58045 12.4473 3.45459 14.0657L5.93896 11.3433V8.35824Z" fill="white"/>
    </svg>
)

const UpiIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.334 14.4534L9.45312 13.2354V10.7648H12.9248L12.3168 11.666H10.334V12.785L11.5139 13.8828H14.1221V10.1568L15 9H7V15H14.1592L13.2783 16H8.38184L7.5 14.8805V9.88049L8.34473 9H16L15.1553 10.1195V14.1195L14.3311 15.239H10.9424L10.334 14.4534Z" fill="white"/>
    </svg>
)


export function PaymentLinkStep({ goNext, goPrev, currentStep, totalSteps }: PaymentLinkStepProps) {
  return (
    <>
      <StepLayout
        title="Link Your Accounts"
        description="Connect your payment methods for seamless tracking and transactions."
      >
        <div className="space-y-3">
            <Button variant="outline" className="w-full h-14 bg-white/10 justify-start text-lg">
                <Apple className="mr-4" /> Apple Pay
            </Button>
            <Button variant="outline" className="w-full h-14 bg-white/10 justify-start text-lg">
                <GPayIcon /> <span className='ml-4'>Google Pay</span>
            </Button>
            <Button variant="outline" className="w-full h-14 bg-white/10 justify-start text-lg">
                <UpiIcon /> <span className='ml-4'>UPI</span>
            </Button>
             <Button variant="outline" className="w-full h-14 bg-white/10 justify-start text-lg">
                <CreditCard className="mr-4" /> Other Card
            </Button>
        </div>
      </StepLayout>
      <OnboardingNavigation
        onNext={goNext}
        onPrev={goPrev}
      >
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
      </OnboardingNavigation>
    </>
  );
}
