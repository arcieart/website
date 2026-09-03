import HeroSection from "@/components/home/HeroSection";
import ClickerSwitchesSection from "@/components/home/ClickerSwitchesSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import PrintingTechnologySection from "@/components/home/PrintingTechnologySection";
import CustomPrintsSection from "@/components/home/CustomPrintsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ClickerSwitchesSection />
      <CategoriesSection />
      <FeaturesSection />
      <PrintingTechnologySection />
      <CustomPrintsSection />
      <CTASection />
    </div>
  );
}
