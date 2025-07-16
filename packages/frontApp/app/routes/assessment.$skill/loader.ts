import { data, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSkillData, getAvailableSkills } from "@/utils/assessmentData";
import { getCurrentSession } from "@/utils/session";

const loader = async ({ request, params }: LoaderFunctionArgs) => {
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

  const skill = params.skill;

  if (!skill) {
    throw new Response("Skill not specified", { status: 400 });
  }

  const skillData = getSkillData(skill);

  if (!skillData) {
    throw new Response("Skill not found", { status: 404 });
  }

  const availableSkills = getAvailableSkills();

  return data(
    {
      skill: params.skill,
      skillData,
      availableSkills,
    },
    { headers }
  );
};

export default loader;
