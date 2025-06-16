import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"
import { toast } from "react-hot-toast"
import { resetCart } from "../../slices/cartSlice"

const { ENROLL_COURSE_API } = studentEndpoints

export async function EnrollCourse(token, courseId, navigate, dispatch) {
  const toastId = toast.loading("Enrolling...")
  try {
    const res = await apiConnector("POST", ENROLL_COURSE_API, { courseId }, {
      Authorization: `Bearer ${token}`,
    })

    if (!res.data.success) throw new Error(res.data.message)

    toast.success("Successfully Enrolled in Course")
    dispatch(resetCart())
    navigate("/dashboard/enrolled-courses")
  } catch (err) {
    console.error("ENROLL ERROR:", err)
    toast.error("Enrollment failed")
  }
  toast.dismiss(toastId)
}
