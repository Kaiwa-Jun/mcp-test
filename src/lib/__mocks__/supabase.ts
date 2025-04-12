export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      order: jest.fn(() => ({
        data: [
          {
            id: "1",
            title: "Test Todo",
            completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        error: null,
      })),
    })),
    insert: jest.fn(() => ({ error: null })),
    update: jest.fn(() => ({ error: null })),
    delete: jest.fn(() => ({ error: null })),
    eq: jest.fn(() => ({ data: null, error: null })),
    in: jest.fn(() => ({ data: null, error: null })),
  })),
};

export const createClient = jest.fn(() => supabase);
