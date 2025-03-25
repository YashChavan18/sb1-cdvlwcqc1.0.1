const testimonials = [
  {
    content: "EduConnect has transformed how we find expert lecturers for our training programs. The quality of educators and the ease of use is outstanding.",
    author: "Sarah Johnson",
    role: "HR Director",
    company: "Tech Solutions Inc."
  },
  {
    content: "As an educator, I've found amazing opportunities to share my knowledge. The platform makes it easy to connect with organizations looking for my expertise.",
    author: "Dr. Michael Chen",
    role: "Data Science Expert",
    company: "Independent Educator"
  },
  {
    content: "The scheduling and payment systems are seamless. It's made managing our educational programs so much more efficient.",
    author: "Emily Rodriguez",
    role: "Learning Manager",
    company: "Global Education Partners"
  }
];

export function Testimonials() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Organizations and Educators
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex flex-col justify-between bg-white p-8 shadow-lg ring-1 ring-gray-900/5 rounded-xl">
                <blockquote className="text-lg leading-7 text-gray-900">
                  "{testimonial.content}"
                </blockquote>
                <div className="mt-6 border-t border-gray-900/5 pt-6">
                  <div className="text-base font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="mt-1 text-sm text-gray-600">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}