import { blog } from '@/.source'
import { loader } from 'fumadocs-core/source'
import { createMDXSource } from './fumadocs-edge-runtime'
import { i18n } from './i18n'

export const source = loader({
  baseUrl: '/blog',
  source: createMDXSource(blog),
  i18n,
});
