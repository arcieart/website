import HeroSection from "@/components/home/HeroSection";
import BestSellersSection from "@/components/home/BestSellersSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import AboutBrandSection from "@/components/home/AboutBrandSection";
import PrintingTechnologySection from "@/components/home/PrintingTechnologySection";
import CustomPrintsSection from "@/components/home/CustomPrintsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* <BestSellersSection /> */}
      <CategoriesSection />
      <FeaturesSection />
      {/* <AboutBrandSection /> */}
      <PrintingTechnologySection />
      <CustomPrintsSection />
      <CTASection />
    </div>
  );
}
