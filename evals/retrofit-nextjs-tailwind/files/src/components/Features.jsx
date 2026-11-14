const items = [
  { icon: '🚀', title: 'Lightning fast', text: 'Supercharge your team with blazing speed.' },
  { icon: '🔒', title: 'Secure by default', text: 'Enterprise-grade security you can trust.' },
  { icon: '✨', title: 'AI powered', text: 'Let AI do the heavy lifting for you.' }
]

export default function Features() {
  return (
    <section id="start" className="mx-auto max-w-5xl px-6 py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-3xl p-8 text-center shadow-lg hover:-translate-y-2">
            <div className="text-4xl">{item.icon}</div>
            <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
      <p className="mt-12 text-center text-gray-500">Trusted by 10,000+ teams · 99.9% uptime</p>
    </section>
  )
}
