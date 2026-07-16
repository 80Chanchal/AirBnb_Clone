import { Link } from 'react-router-dom'
import { FiGlobe } from 'react-icons/fi'

const columns = [
  ['Support', ['Help Centre', 'AirCover', 'Anti-discrimination', 'Disability support', 'Cancellation options']],
  ['Hosting', ['Airbnb your home', 'AirCover for Hosts', 'Hosting resources', 'Community forum', 'Responsible hosting']],
  ['Airbnb', ['Newsroom', 'New features', 'Careers', 'Investors', 'Gift cards']],
]

export default function Footer() {
  return <footer className="mt-auto border-t border-brand-border bg-brand-light text-brand-dark">
    <div className="mx-auto max-w-[1760px] px-6 py-10 lg:px-10">
      <div className="grid gap-8 md:grid-cols-3">
        {columns.map(([title, links]) => <div key={title} className="border-b border-brand-border pb-6 md:border-b-0 md:pb-0"><h3 className="mb-4 text-sm font-bold">{title}</h3><ul className="space-y-3">{links.map(label => <li key={label}><Link to={label === 'Airbnb your home' ? '/register?role=host' : '#'} className="text-sm hover:underline">{label}</Link></li>)}</ul></div>)}
      </div>
      <div className="mt-10 flex flex-col justify-between gap-4 border-t border-brand-border pt-6 text-sm font-medium md:flex-row md:items-center"><div>© {new Date().getFullYear()} Airbnb, Inc. · <a href="#" className="hover:underline">Privacy</a> · <a href="#" className="hover:underline">Terms</a> · <a href="#" className="hover:underline">Sitemap</a></div><div className="flex items-center gap-5"><button className="flex items-center gap-2 hover:underline"><FiGlobe /> English (IN)</button><button className="hover:underline">₹ INR</button></div></div>
    </div>
  </footer>
}
