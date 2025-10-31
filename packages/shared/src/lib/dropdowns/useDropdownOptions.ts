import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DropdownOption } from './types'

/**
 * Fetch dropdown options for shot fields
 * Can filter by specific field_name or fetch all options
 *
 * @param fieldName - Optional field name to filter options
 * @param supabaseClient - Injected Supabase client instance (enables app-agnostic usage)
 * @returns UseQueryResult containing dropdown options array
 */
export function useDropdownOptions(
  fieldName: string | undefined,
  supabaseClient: SupabaseClient
): UseQueryResult<DropdownOption[], Error> {
  return useQuery({
    queryKey: ['dropdownOptions', fieldName],
    queryFn: async (): Promise<DropdownOption[]> => {
      // Note: dropdown_options table exists in database but not in shared-lib types yet
      // Using type assertion until types are regenerated
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      let query = (supabaseClient as any)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .from('dropdown_options')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .select('id, field_name, option_value, option_label, sort_order, created_at')

      if (fieldName) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        query = query.eq('field_name', fieldName)
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const { data, error } = await query.order('sort_order', { ascending: true })

      if (error) throw error

      return (data || []) as DropdownOption[]
    },
  })
}
