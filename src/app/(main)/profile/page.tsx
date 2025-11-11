
'use client';

import * as React from 'react';
import Image from 'next/image';
import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { User, Goal } from '@/firebase/auth/types';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, Award, CheckCircle, BarChart, Edit } from 'lucide-react';
import { animate, useInView } from 'framer-motion';

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        }
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-8">
      <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-10 w-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-1/4 ml-auto" />
          </div>
        </CardContent>
      </Card>
      <div className="p-4 rounded-xl" style={{ background: 'hsl(var(--muted) / 0.5)', backdropFilter: 'blur(12px)'}}>
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
            <CardHeader>
              <Skeleton className="h-8 w-8" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const avatarData = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const goalsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, `users/${user.uid}/goals`);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserLoading } = useDoc<User>(userDocRef);
  const { data: goals, isLoading: areGoalsLoading } = useCollection<Goal>(goalsCollectionRef);

  // Set initial hardcoded XP here. This will be overwritten by Firestore data once loaded.
  const initialXp = 9000;
  
  React.useEffect(() => {
    // One-time effect to set the initial XP for the demo if it's not set in Firestore
    if (userDocRef && userData && userData.xp === 0) {
      updateDocumentNonBlocking(userDocRef, { xp: initialXp, level: Math.floor(initialXp / 1000) });
    }
  }, [userDocRef, userData]);


  if (isUserLoading || areGoalsLoading || !userData || !goals) {
    return <ProfilePageSkeleton />;
  }
  
  const { xp = initialXp, displayName } = userData || {};

  // Hardcode goals completed for demonstration
  const goalsCompleted = 67;
  
  const level = Math.floor(xp / 1000);
  const xpForCurrentLevel = level * 1000;
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForNextLevel = 1000;
  const xpPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;
  const xpToNextLevel = xpNeededForNextLevel - xpInCurrentLevel;

  const totalSaved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  // Mock efficiency for now
  const budgetEfficiency = 85; 

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-8">
      {/* User Overview Card */}
      <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary/50">
              {avatarData && <AvatarImage src={avatarData.imageUrl} alt={avatarData.description} />}
              <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold font-headline">{displayName}</h1>
              <p className="text-sm text-muted-foreground">Level {level}</p>
            </div>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <Progress value={xpPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {xp.toLocaleString()} / {(level + 1) * 1000} XP ({xpToNextLevel.toLocaleString()} to next level)
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Badges & Achievements Section */}
      <div
        className="p-4 rounded-xl space-y-4"
        style={{
          background: 'hsl(var(--muted) / 0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <h3 className="text-lg font-bold font-headline uppercase tracking-wider">Achievements</h3>
        <div className="flex items-center justify-center h-24">
            <p className="text-muted-foreground">Your earned badges will appear here!</p>
        </div>
      </div>


      {/* Financial Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
          <CardHeader>
             <Award className="h-8 w-8 text-accent" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-headline">
              <AnimatedNumber value={totalSaved} prefix="$" />
            </p>
            <p className="text-sm text-muted-foreground">Total Saved</p>
          </CardContent>
        </Card>
        <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
          <CardHeader>
             <CheckCircle className="h-8 w-8 text-green-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-headline">
               <AnimatedNumber value={goalsCompleted} />
            </p>
            <p className="text-sm text-muted-foreground">Goals Completed</p>
          </CardContent>
        </Card>
        <Card style={{ background: "hsla(0, 0%, 100%, 0.05)", backdropFilter: "blur(12px)" }}>
          <CardHeader>
             <BarChart className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold font-headline">
              <AnimatedNumber value={budgetEfficiency} suffix="%" />
            </p>
            <p className="text-sm text-muted-foreground">Budget Efficiency</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
