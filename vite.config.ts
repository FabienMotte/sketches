import { resolve } from 'path'

export default {
  port: 4000,
  alias: {
    '/@src/': resolve(__dirname, 'src'),
    '/@assets/': resolve(__dirname, 'src', 'assets'),
    '/@utils/': resolve(__dirname, 'src', 'utils'),
    '/@helpers/': resolve(__dirname, 'src', 'helpers'),
  },
}
