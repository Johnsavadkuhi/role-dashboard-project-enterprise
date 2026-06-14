import { describe, expect, it } from "vitest";
import { API_BASE_URL, SOCKET_PATH, SOCKET_URL } from "@/config/backend";

describe("backend connection configuration", () => {
  it("keeps REST and Socket.IO on the same default origin", () => {
    expect(API_BASE_URL).toBe("http://localhost:4000/api");
    expect(SOCKET_URL).toBe("http://localhost:4000");
    expect(SOCKET_PATH).toBe("/socket.io");
  });
});
