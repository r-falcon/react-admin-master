/**
 * feat：新功能
 * upd：更新
 * del：删除
 * fix: 修复bug
 * refactor：结构上的优化（函数改个名字等）
 * test：新增或修改已有的测试代码
 * perf：优化了性能的代码改动
 * docs：更新的文档（例如更新readme）
 * style：样式美化（css修改缩进等）
 * revert：还原、恢复
 * chore：跟仓库主要业务⽆关的构建/⼯程依赖/⼯具等功能改动（⽐如新增⼀个⽂档⽣成⼯具）
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'upd', 'del', 'fix', 'refactor', 'test', 'perf', 'docs', 'style', 'revert', 'chore'],
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  },
};
