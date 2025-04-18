import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
  return (
    <div className="feature-card group p-3 sm:p-4 md:p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-1.5 sm:p-2 md:p-3 bg-mathmate-100 dark:bg-mathmate-600 rounded-lg inline-block mb-2 sm:mb-3 md:mb-4 group-hover:bg-mathmate-300 dark:group-hover:bg-mathmate-500 transition-colors">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-mathmate-500 dark:text-mathmate-100 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 line-clamp-3">{description}</p>
    </div>
  );
};

export default FeatureCard;