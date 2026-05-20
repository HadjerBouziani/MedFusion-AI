import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CaseProvider } from "./context/case-context";
import { ThemeProvider } from "./context/theme-context";
import { UserProvider } from "./context/user-context";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <CaseProvider>
          <RouterProvider router={router} />
          <Toaster />
        </CaseProvider>
      </UserProvider>
    </ThemeProvider>
  );
}