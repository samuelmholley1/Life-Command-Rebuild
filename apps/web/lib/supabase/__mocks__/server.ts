export const createSupabaseServerClient = jest.fn().mockReturnValue({
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockResolvedValue({ data: [], error: null }),
    insert: jest.fn().mockResolvedValue({ data: [], error: null }),
    update: jest.fn().mockResolvedValue({ data: [], error: null }),
  })),
});
