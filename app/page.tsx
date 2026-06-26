"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/hero/HeroSection";
import BuildersSection from "@/components/sections/builders/BuildersSection";
import MembersSection from "@/components/sections/members/MembersSection";
import CoworkingSection from "@/components/sections/coworking/CoworkingSection";
import MembershipSection from "@/components/sections/membership/MembershipSection";
import CommunityBenefitsSection from "@/components/sections/membership/CommunityBenefitsSection";
import JoinSection from "@/components/sections/membership/JoinSection";

const EventsSection = dynamic(() => import("@/components/sections/events/EventsSection"), { ssr: false });
const Footer = dynamic(() => import("@/components/layout/Footer"));

export default function Home() {
  const pillRef = useRef<HTMLElement | null>(null);

  return (
    <main className="bg-white overflow-x-hidden">
      <Navbar pillRef={pillRef} />
      <HeroSection pillRef={pillRef} />
      <BuildersSection />
      <MembersSection />
      <CoworkingSection />
      <MembershipSection />
      <CommunityBenefitsSection />
      <JoinSection />
      <EventsSection />
      <Footer />
    </main>
  );
}
