interface SupabaseClient {
  from: (table: string) => any
  auth: any
}

const createMockClient = (): SupabaseClient => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        limit: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          then: (cb: any) => Promise.resolve({ data: null, error: null }).then(cb)
        }),
        then: (cb: any) => Promise.resolve({ data: null, error: null }).then(cb)
      }),
      or: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          then: (cb: any) => Promise.resolve({ data: null, error: null }).then(cb)
        }),
        order: () => ({
          then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
        }),
        limit: () => ({
          then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
        }),
        then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
      }),
      order: () => ({
        limit: () => ({
          then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
        }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          then: (cb: any) => Promise.resolve({ data: null, error: null }).then(cb)
        }),
        then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
      }),
      limit: () => ({
        then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
      }),
      then: (cb: any) => Promise.resolve({ data: [], error: null }).then(cb)
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      }),
      then: (cb: any) => Promise.resolve({ data: null, error: null }).then(cb)
    })
  }),
  auth: {
    signInWithOtp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null })
  },
  channel: () => ({
    on: () => ({
      subscribe: () => ({})
    }),
    removeChannel: () => ({})
  }),
  removeChannel: () => ({})
})

const supabase: SupabaseClient = createMockClient()

export { supabase }