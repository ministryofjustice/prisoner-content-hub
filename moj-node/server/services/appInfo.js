const path = require('path');
const { execSync } = require('child_process');

function execGit(args) {
  return execSync(`git ${args}`, {
    cwd: path.resolve(__dirname, '../..'),
    env: {
      PATH: process.env.PATH,
      TZ: 'UTC',
    },
    encoding: 'utf-8',
  }).trim();
}

function staticAppInfo(buildInfo) {
  return {
    getBuildInfo() {
      return buildInfo;
    },
    getGitRef() {
      return buildInfo.gitRef;
    },
    getGitDate() {
      return new Date(buildInfo.gitDate);
    },
  };
}

function dynamicAppInfo() {
  return {
    getGitRef() {
      return execGit('log -n1 --format=%H');
    },
    getGitDate() {
      return new Date(execGit('log -n1 --format=%cd --date=iso'));
    },
    getBuildInfo() {
      return {
        buildNumber: 'dev',
        gitRef: this.getGitRef(),
        gitDate: this.getGitDate(),
      };
    },
  };
}

module.exports = function createAppInfoService(buildInfo = null) {
  if (!buildInfo) {
    return dynamicAppInfo();
  }
  return staticAppInfo(buildInfo);
};
