import { headers } from 'next/headers'
import { getClientInfo, getGitHubFile } from '@/lib/github'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Book } from '@/types/content'
import Image from 'next/image'
import { BookOpen, ExternalLink } from 'lucide-react'
import BookCard from '@/components/portfolio/BookCard'

interface Props { params: { subdomain: string } }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getClientInfo(params.subdomain)
  return { title: `Books — ${c?.personal.full_name || ''}` }
}

export default async function BooksPage({ params }: Props) {
  const subdomain = headers().get('x-folyx-subdomain') || params.subdomain
  const client = await getClientInfo(subdomain)
  if (!client) notFound()

  const raw = await getGitHubFile(`${subdomain}-portfolio`, 'content/books.json')
  const books: Book[] = raw ? JSON.parse(raw) : []

  return (
    <div className="pt-24">
      <section className="section-sm">
        <div className="container-folyx">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div className="section-label !mb-0">Studio</div>
          </div>
          <h1 className="mb-2">Books</h1>
          <p className="text-[var(--t2)] mb-10">Reading list, library, and book reviews.</p>

          {books.length === 0 ? (
            <div className="card p-12 text-center text-[var(--t3)]">No books added yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {books.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
