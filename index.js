module.exports = (robot) => {
  //activated our robot to listen for pull request webhook
  robot.on('pull_request', async context => {
     
      const pull_requests = context.payload.pull_request;
   //getting all_commits in that pull request
      const all_commits = await context.github.repos.compareCommits(context.repo({
          base: pull_requests.base.sha,
          head: pull_requests.head.sha 
      }));

   //does all commits contain banana
      const check_banana = all_commits.data.commits.every(data => {
          return data.commit.message.match(/bananas/i);
      });

      const params = {
          sha: pull_requests.head.sha,
          context: 'bananas',
          state: check_banana ? 'success' : 'failure',
          description: `Bananas are ${check_banana ? 'present' : 'missing'} `
      }
    //send the status for bananas
      return context.github.repos.createStatus(context.repo(params));
      });
};
