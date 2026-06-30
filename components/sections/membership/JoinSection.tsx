"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { useLang } from "@/lib/LanguageContext";
import { useInView } from "@/hooks/useInView";

const galleryImages = [
    { src: "/become-member/gallery/image-1.png", hClass: "h-[448px]" },
    { src: "/become-member/gallery/image-2.png", hClass: "h-[400px]" },
    { src: "/become-member/gallery/image-3.png", hClass: "h-[352px]" },
    { src: "/become-member/gallery/image-4.png", hClass: "h-[400px]" },
    { src: "/become-member/gallery/image-5.png", hClass: "h-[448px]" },
];

export default function JoinSection() {
    const { t } = useLang();
    const headerRef = useInView<HTMLDivElement>(0.2);
    const galleryRef = useInView<HTMLDivElement>(0.1);

    return (
        <section id="membership" className="relative w-full bg-white pt-20 md:pt-[clamp(60px,7vw,120px)] pb-0">
            {/* Header */}
            <div
                ref={headerRef}
                className="anim-wrap flex flex-col items-center text-center px-6 md:px-site"
            >
                <h2
                    className="anim-fade-up text-foreground font-normal leading-[1.05] font-heading text-[clamp(2rem,3.33vw,3rem)]"
                >
                    {t.becomeMember.title}
                </h2>

                <p
                    className="anim-fade-up anim-d1 mt-4 md:mt-6 text-foreground/70 font-medium leading-relaxed max-w-[640px] font-sans text-[clamp(0.9rem,1.25vw,1.125rem)]"
                >
                    {t.becomeMember.subtitle}
                </p>

                <div className="anim-fade-up anim-d2 flex flex-wrap justify-center gap-4 mt-8 md:mt-10">
                    <Button variant="primary" href="https:/vinteum.org/contact" showArrow>
                        {t.becomeMember.ctaPrimary}
                    </Button>
                </div>
            </div>

            {/* Gallery — no horizontal padding on mobile for edge-bleed effect */}
            <div className="mt-12 md:mt-16 md:px-site">
                <div
                    ref={galleryRef}
                    className="anim-wrap flex items-end gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-x-visible"
                >
                    {galleryImages.map((img, i) => (
                        <div
                            key={img.src}
                            className={`anim-fade-up relative flex-shrink-0 w-[288px] md:w-auto md:flex-1 overflow-hidden rounded-2xl ${img.hClass} ${i === 0 ? "ml-6 md:ml-0" : ""} ${i === galleryImages.length - 1 ? "mr-6 md:mr-0" : ""}`}
                            style={{ transitionDelay: `${i * 90}ms` }}
                        >
                            <Image
                                src={img.src}
                                alt={`Casa21 community photo ${i + 1}`}
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
