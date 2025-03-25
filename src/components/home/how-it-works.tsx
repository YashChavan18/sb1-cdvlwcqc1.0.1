import { CircleDot, GraduationCap, MessageSquare, UserCheck } from "lucide-react";

const steps = [
  {
    title: "Create an Account",
    description: "Sign up as an organization or educator. Complete your profile with relevant details.",
    icon: UserCheck,
  },
  {
    title: "Post or Browse",
    description: "Organizations can post teaching requirements, while educators browse and apply for opportunities.",
    icon: GraduationCap,
  },
  {
    title: "Connect",
    description: "Review applications, chat with potential matches, and find the perfect fit.",
    icon: MessageSquare,
  },
  {
    title: "Start Learning",
    description: "Schedule sessions, conduct classes, and share knowledge effectively.",
    icon: CircleDot,
  },
];

export function HowItWorks() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Simple Process</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How EduConnect Works
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Follow these simple steps to start your learning journey or share your expertise
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex flex-col items-start">
                <div className="rounded-full bg-blue-600/10 p-3 ring-1 ring-blue-600/20">
                  <step.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="mt-4 flex items-center gap-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-600 text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">{step.title}</h3>
                </div>
                <p className="mt-4 text-base leading-7 text-gray-600">{step.description}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}