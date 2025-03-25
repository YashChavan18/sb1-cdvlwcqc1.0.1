import { BookOpen, Calendar, MessageSquare, Shield } from "lucide-react";

const features = [
  {
    name: 'Expert Educators',
    description: 'Connect with qualified and experienced educators from various fields.',
    icon: BookOpen,
  },
  {
    name: 'Secure Platform',
    description: 'Safe and secure environment for both organizations and educators.',
    icon: Shield,
  },
  {
    name: 'Easy Scheduling',
    description: 'Efficient scheduling system to manage sessions and availability.',
    icon: Calendar,
  },
  {
    name: 'Direct Communication',
    description: 'Built-in messaging system for seamless communication.',
    icon: MessageSquare,
  },
];

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Platform Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage learning sessions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform provides all the tools necessary for organizations to find the right educators
            and for educators to connect with teaching opportunities.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-blue-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}