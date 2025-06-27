const chatManager = require("../chatManager.js");
const {
  registerUser,
  removeUser,
  getOnlineSocket,
  bufferMessage,
  deliverBufferedMessages,
  storeChatHistory,
  getChatHistory,
  _clearAll,
} = chatManager;

describe("Chat Manager Tests", () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = { emit: jest.fn() };
    registerUser("alice", mockSocket);
  });

  afterEach(() => {
    _clearAll(); 
  });

  test("should register and retrieve a user", () => {
    expect(getOnlineSocket("alice")).toBe(mockSocket);
  });

  test("should overwrite user on re-register", () => {
    const newSocket = { emit: jest.fn() };
    registerUser("alice", newSocket);
    expect(getOnlineSocket("alice")).toBe(newSocket);
  });

  test("should remove a user", () => {
    removeUser("alice");
    expect(getOnlineSocket("alice")).toBeUndefined();
  });

  test("removing a non-existent user shouldn't throw", () => {
    expect(() => removeUser("ghost")).not.toThrow();
  });

  test("should buffer and deliver messages", () => {
    bufferMessage("bob", { content: "Hi Bob" });
    const socketBob = { emit: jest.fn() };
    registerUser("bob", socketBob);

    deliverBufferedMessages("bob");

    expect(socketBob.emit).toHaveBeenCalledWith("receive_message", {
      content: "Hi Bob",
    });
  });

  test("should not fail if user has no buffered messages", () => {
    const socketBob = { emit: jest.fn() };
    registerUser("bob", socketBob);
    expect(() => deliverBufferedMessages("bob")).not.toThrow();
  });

  test("should store and retrieve chat history", () => {
    const msg = { from: "alice", to: "bob", content: "Hello" };
    storeChatHistory("alice", "bob", msg);

    const history = getChatHistory("bob", "alice");
    expect(history.length).toBe(1);
    expect(history[0].content).toBe("Hello");
  });

  test("should return empty array for no chat history", () => {
    const history = getChatHistory("alice", "charlie");
    expect(Array.isArray(history)).toBe(true);
    expect(history.length).toBe(0);
  });

  test("chat history key should be order independent", () => {
    const msg = { from: "bob", to: "alice", content: "Hey there" };
    storeChatHistory("bob", "alice", msg);

    const history = getChatHistory("alice", "bob");
    expect(history[0].content).toBe("Hey there");
  });
});
