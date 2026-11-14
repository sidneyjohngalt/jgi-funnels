import { redirect } from "next/navigation";

/** Booking now happens as the last step of the application. Old links land there. */
export default function BookPage() {
  redirect("/apply");
}
