
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
  return (
    <div className="feature-card group">
      <div className="p-3 bg-mathmate-100 dark:bg-mathmate-600 rounded-lg inline-block mb-4 group-hover:bg-mathmate-300 dark:group-hover:bg-mathmate-500 transition-colors">
        <Icon className="h-6 w-6 text-mathmate-500 dark:text-mathmate-100 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default FeatureCard;
