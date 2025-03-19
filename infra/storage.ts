import * as random from "@pulumi/random";

export const bucket = new sst.aws.Bucket("dododoStorage");

//

const SupbaseOrgId = new sst.Secret("SupabaseOrgId");

sst.Linkable.wrap(supabase.Project, function (project) {
  return {
    properties: {
      user: $interpolate`postgres.${project.id}`,
      password: project.databasePassword,
      host: $interpolate`aws-0-${project.region}.pooler.supabase.com`,
      database: "postgres",
      port: 6543,
    },
  };
});

export const database: supabase.Project = new supabase.Project(
  "dododoDatabase",
  {
    name: $interpolate`${$app.name}-${$app.stage}`,
    region: "eu-west-2",
    organizationId: SupbaseOrgId.value,
    databasePassword: new random.RandomString("DatabasePassword", {
      length: 16,
      special: false,
    }).result,
  }
);
