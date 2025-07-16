import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";

import { getCurrentSession } from "@/utils/session";
import { getAssessmentData, getAvailableSkills } from "@/utils/assessmentData";

const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user, headers } = await getCurrentSession(request.headers);

  if (!user) {
    const url = new URL(request.url);
    return redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`, {
      headers,
    });
  }

  if (!user?.emailVerified) {
    return redirect("/verify-email", { headers });
  }

  const assessmentData = getAssessmentData();
  const availableSkills = getAvailableSkills();

  return data(
    {
      availableSkills,
      assessmentData,
    },
    { headers }
  );
};

export default loader;
