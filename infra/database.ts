// const project = new neon.Project(
//   "dododoServerlessDB",
//   {
//     name: "dododo",
//     regionId: "aws-eu-west-2",
//     historyRetentionSeconds: 86400,
//   },
//   {
//     protect: true,
//   }
// );

// const branch = new neon.Branch("mainDododoBranch", {
//   projectId: project.id,
//   name: "main",
// });

// const endpoint = new neon.Endpoint("mainDododoEndpoint", {
//   projectId: project.id,
//   branchId: project.branch.id,
//   type: "read_write",
// });

// const database = new neon.Database("mainDododoDatabase", {
//   projectId: project.id,
//   name: "dododo-database",
//   branchId: project.branch.id,
//   ownerName: "neondb_owner",
// });

// export { project };
