'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
console.log('base url:' + BASE_URL)

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}

      <Link href={`${BASE_URL}/`} className="text-primary">
        Homepage
      </Link>
      <Link href={`${BASE_URL}/contact`} className="text-primary">
        Contact
      </Link>
    </nav>
  )
}
