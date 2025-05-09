// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock the localStorage
beforeEach(() => {
  // localStorage をモックする
  const localStorageMock = (function () {
    let store = {};
    return {
      getItem: jest.fn((key) => {
        return store[key] || null;
      }),
      setItem: jest.fn((key, value) => {
        store[key] = String(value);
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      length: Object.keys(store).length,
      key: jest.fn((i) => Object.keys(store)[i] || null),
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
});

// Framer Motionのモックを作成
jest.mock("framer-motion", () => {
  const React = require("react");

  // Propsから 'layout' を削除する関数
  const filterProps = (props) => {
    const { layout, initial, animate, exit, transition, ...filteredProps } =
      props;
    return filteredProps;
  };

  return {
    motion: {
      div: ({ children, ...props }) =>
        React.createElement("div", filterProps(props), children),
      span: ({ children, ...props }) =>
        React.createElement("span", filterProps(props), children),
      li: ({ children, ...props }) =>
        React.createElement("li", filterProps(props), children),
      // 他のHTML要素も同様に定義可能
    },
    AnimatePresence: ({ children }) => children,
  };
});

// Supabaseのモックを作成
jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: jest.fn(() => ({
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
        eq: jest.fn(() => ({ error: null })),
        in: jest.fn(() => ({ error: null })),
      })),
    })),
  };
});
