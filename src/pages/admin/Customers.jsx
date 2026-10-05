import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Users } from 'lucide-react'
import { api } from '@/lib/api.js'
import { money, date } from '@/lib/format.js'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/kit.jsx'
import { AdminHead, SearchBox, TableCard, Table, Th, Td } from '@/components/admin/ui.jsx'

const SORTS = [['recent', 'الأحدث'], ['spent', 'الأعلى شراءً'], ['orders', 'الأكثر طلبات']]
const wa = (p) => `https://wa.me/${p.replace(/\D/g, '').replace(/^0/, '966')}`

export default function Customers() {
  const [list, setList] = useState(null)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('recent')
  useEffect(() => { api.listCustomers().then(setList).catch(() => setList([])) }, [])
  const shown = useMemo(() => {
    const l = (list || []).filter((c) => !q || ((c.name || '') + (c.email || '') + (c.phone || '')).includes(q))
    return [...l].sort((a, b) => sort === 'spent' ? b.spent - a.spent : sort === 'orders' ? b.orders - a.orders : new Date(b.createdAt) - new Date(a.createdAt))
  }, [list, q, sort])
  const buyers = (list || []).filter((c) => c.orders > 0).length

  return (
    <>
      <AdminHead title="العملاء" lead={list ? `${list.length} عميل مسجّل · ${buyers} اشتروا` : undefined} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBox value={q} onChange={setQ} placeholder="الاسم، البريد، أو الجوال" className="w-full max-w-md" />
        <div className="flex rounded-full bg-sunken p-1" role="tablist" aria-label="الترتيب">
          {SORTS.map(([id, l]) => <button key={id} role="tab" aria-selected={sort === id} onClick={() => setSort(id)} className={cn('h-9 rounded-full px-3 text-xs font-bold', sort === id ? 'bg-surface text-primary shadow-hairline' : 'text-muted-foreground')}>{l}</button>)}
        </div>
      </div>
      {!list ? <Skeleton className="h-96" /> : shown.length === 0 ? (
        <div className="grid justify-items-center gap-2 rounded-lg border-2 border-dashed border-border-strong py-16 text-center"><Users className="size-8 text-muted-foreground" /><p className="text-muted-foreground">ما فيه عملاء هنا.</p></div>
      ) : (
        <>
          <ul className="grid gap-2 md:hidden">
            {shown.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-lg bg-surface p-4 shadow-hairline ring-1 ring-border">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sunken font-display font-bold text-primary">{(c.name || c.email || '؟').charAt(0)}</span>
                <div className="min-w-0 flex-1"><p className="truncate font-semibold">{c.name}</p><p className="tabular text-xs text-muted-foreground">{c.orders} طلب · {money(c.spent)}</p></div>
                {c.phone && <a href={wa(c.phone)} target="_blank" rel="noreferrer" className="grid size-10 place-items-center rounded-full bg-primary text-accent" aria-label={`واتساب ${c.name}`}><MessageCircle className="size-4" /></a>}
              </li>
            ))}
          </ul>
          <TableCard className="hidden md:block">
            <Table>
              <thead><tr><Th>العميل</Th><Th>الجوال</Th><Th>الطلبات</Th><Th>إجمالي المشتريات</Th><Th>تاريخ التسجيل</Th></tr></thead>
              <tbody>{shown.map((c) => (
                <tr key={c.id} className="hover:bg-sunken/50">
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sunken font-display text-sm font-bold text-primary">{(c.name || c.email || '؟').charAt(0)}</span>
                      <div className="min-w-0"><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground" dir="ltr">{c.email}</p></div>
                    </div>
                  </Td>
                  <Td>{c.phone ? <a className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline" href={wa(c.phone)} target="_blank" rel="noreferrer"><MessageCircle className="size-4" /><span dir="ltr">{c.phone}</span></a> : <span className="text-muted-foreground">—</span>}</Td>
                  <Td className="tabular">{c.orders}</Td>
                  <Td className="tabular font-semibold text-primary">{money(c.spent)}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{date(c.createdAt)}</Td>
                </tr>
              ))}</tbody>
            </Table>
          </TableCard>
        </>
      )}
    </>
  )
}
