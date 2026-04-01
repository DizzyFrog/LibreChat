# 考研数学辅导产品 MVP 方案

## 背景

当前项目基于 LibreChat 进行二次开发。现有能力已经具备：

- 通用聊天能力
- Agent 能力
- Memory 能力
- 前端 dashboard 和 side panel 扩展基础

本次改造目标不是做一个通用问答机器人，而是做一个面向考研数学场景的专门辅导软件，核心价值是：

- 查漏补缺
- 苏格拉底式引导学习
- 根据用户情况动态调整学习计划
- 通过可视化方式呈现进度、薄弱点和补强路径

---

## 产品目标

MVP 聚焦三个结果：

1. 用户可以快速生成自己的考研数学学习计划
2. 用户可以在聊天中通过引导式解题暴露真实薄弱点
3. 用户可以在面板中看到任务进度、知识薄弱点和计划调整结果

---

## 目标用户

- 考研数学一用户
- 考研数学二用户
- 考研数学三用户
- 需要从某一章节开始补基础或冲刺的学生

---

## 核心能力

### 1. 学习中枢

负责根据用户输入生成并动态更新学习计划。

输入信息包括：

- 数一 / 数二 / 数三
- 目标考试时间
- 起始学习章节
- 计划周期
- 每日可投入时间
- 当前基础水平

输出结果包括：

- 阶段计划
- 周计划
- 每日任务
- 调整建议

### 2. 保姆型辅导员 Agent

定位是长期陪跑的教练型 Agent。

职责包括：

- 拆解学习目标
- 安排每日和每周任务
- 根据完成情况调整节奏
- 进行阶段复盘
- 提醒用户补短板而不是平均分配时间

### 3. 苏格拉底解题 Agent

定位是引导式解题，不直接给答案。

职责包括：

- 通过追问引导用户思考
- 判断用户卡在概念、建模、推导还是计算
- 在多轮对话后输出诊断结果
- 将诊断结果反哺用户画像

### 4. 薄弱点分析与用户画像

系统需要从以下来源持续更新用户画像：

- 计划执行情况
- 章节完成情况
- 解题对话过程
- 错题和卡点类型

最终沉淀为可视化的薄弱点图谱，而不是只保存自然语言聊天记录。

### 5. 学习进度可视化

前端需要提供专门面板，而不只是聊天窗口。

建议呈现：

- 今日任务
- 本周进度
- 章节完成率
- 薄弱知识点热度
- 最近计划调整记录

---

## MVP 范围

第一阶段只做最短闭环，不做过度复杂的智能调度。

MVP 范围包括：

- 首次评估与基础信息采集
- 初始学习计划生成
- 每日任务和进度面板
- 苏格拉底式解题模式
- 薄弱点记录与可视化基础版

MVP 暂不优先做：

- 复杂题库系统
- 大规模错题本运营能力
- 多角色教师协作
- 高级班级/社群体系
- 精细化积分和游戏化系统

---

## 推荐的产品结构

### 聊天入口

保留 LibreChat 原有会话体验，新增专用学习模式：

- 辅导员模式
- 苏格拉底解题模式
- 错题复盘模式

### 学习面板入口

新增 dashboard 路由，而不是只依赖 side panel。

建议的路由结构：

- `/d/study/overview`
- `/d/study/plan`
- `/d/study/tasks`
- `/d/study/weakness`
- `/d/study/assessment`

---

## Agent 体系建议

### Agent 1：辅导员

职责：

- 生成学习计划
- 调整学习节奏
- 布置任务
- 做阶段复盘

特点：

- 强目标导向
- 强时间意识
- 优先补短板

### Agent 2：苏格拉底引导者

职责：

- 逐步追问
- 不轻易直接给答案
- 定位卡点来源
- 输出诊断信号

特点：

- 重思维过程
- 重定位问题
- 重反馈画像

### Agent 3：诊断分析器

职责：

- 汇总多轮聊天和任务表现
- 更新薄弱点图谱
- 生成补救建议

说明：

MVP 阶段可以先不直接暴露给用户，作为后台分析服务存在即可。

---

## 数据建模建议

当前通用 memory 更适合保存少量偏好，不适合承载学习计划和画像。学习域需要独立的数据模型。

建议新增以下领域模型：

### 1. syllabus

用途：

- 存放数一、数二、数三的大纲和章节结构

建议字段：

- `examType`
- `subject`
- `chapter`
- `section`
- `knowledgePoint`
- `difficultyWeight`
- `prerequisites`

### 2. profile

用途：

- 存放用户的学习目标和基础画像

建议字段：

- `userId`
- `examType`
- `targetDate`
- `dailyHours`
- `foundationLevel`
- `pacePreference`

### 3. mastery

用途：

- 存放知识点掌握度

建议字段：

- `knowledgePointId`
- `masteryScore`
- `confidenceScore`
- `lastPracticedAt`
- `errorTags`

### 4. plan

用途：

- 存放动态学习计划

建议字段：

- `planVersion`
- `startDate`
- `endDate`
- `status`
- `strategy`

### 5. task

用途：

- 存放每日和每周学习任务

建议字段：

- `planId`
- `taskType`
- `chapterId`
- `knowledgePointIds`
- `estimatedMinutes`
- `status`

### 6. attempt

用途：

- 存放解题过程和诊断记录

建议字段：

- `source`
- `prompt`
- `knowledgePointIds`
- `mistakeType`
- `scoreDelta`

---

## 仓库落位建议

遵循当前仓库约束：

### 1. `packages/data-schemas`

放学习域 schema、model、type。

建议新建：

- `packages/data-schemas/src/schema/study/`
- `packages/data-schemas/src/models/study/`
- `packages/data-schemas/src/types/study/`

### 2. `packages/api`

放全部新后端业务逻辑，使用 TypeScript。

建议新建：

- `packages/api/src/study/assessment/`
- `packages/api/src/study/plan/`
- `packages/api/src/study/task/`
- `packages/api/src/study/profile/`
- `packages/api/src/study/diagnostics/`

### 3. `api`

只做薄路由接入，不堆复杂逻辑。

### 4. `packages/data-provider`

补充：

- api endpoints
- data service
- query keys
- 类型定义

### 5. `client`

新增 study dashboard 和学习任务相关页面。

---

## 前端 MVP 页面建议

### 1. 学习总览页

展示：

- 今日任务
- 本周完成率
- 最近薄弱点
- 最近一次计划调整说明

### 2. 学习计划页

展示：

- 当前阶段
- 周计划
- 各章节安排
- 调整历史

### 3. 任务页

展示：

- 今日待完成任务
- 已完成任务
- 延期任务

### 4. 薄弱点页

展示：

- 章节薄弱度
- 知识点掌握度
- 常见错误类型

### 5. 初始评估页

用于：

- 收集考试类型
- 收集目标时间
- 收集起始章节
- 收集可投入时长
- 生成第一版计划

---

## API MVP 建议

建议优先提供以下接口：

### assessment

- `POST /api/study/assessment`
- `GET /api/study/assessment/current`

### profile

- `GET /api/study/profile`
- `PATCH /api/study/profile`

### plan

- `POST /api/study/plan`
- `GET /api/study/plan/current`
- `POST /api/study/plan/rebuild`

### task

- `GET /api/study/tasks`
- `PATCH /api/study/tasks/:taskId`

### weakness

- `GET /api/study/weakness`

### diagnostics

- `POST /api/study/diagnostics`

---

## Agent 行为约束建议

### 辅导员 Agent

- 所有建议必须围绕考试目标和剩余时间展开
- 优先补短板，不做平均主义安排
- 任务安排必须考虑用户每日时长约束
- 计划变更必须可解释

### 苏格拉底 Agent

- 默认不直接给完整答案
- 优先通过追问定位卡点
- 每轮交互都应尝试判断问题类型
- 对话结束后必须产出结构化诊断结果

---

## 分阶段实施建议

### Phase 1

目标：

- 完成学习域最小数据建模
- 完成初始评估
- 完成初始计划生成
- 完成基础 dashboard 页面

### Phase 2

目标：

- 完成任务系统
- 完成进度可视化
- 支持任务完成、延期、重排

### Phase 3

目标：

- 上线苏格拉底解题 Agent
- 将对话诊断写入 attempt 和 weakness 数据

### Phase 4

目标：

- 基于任务结果和诊断结果自动调计划
- 形成真正的动态学习路径

---

## 当前结论

本项目最合理的演进方式不是继续强化通用聊天，而是在 LibreChat 已有 Agent 能力之上增加一层学习领域模型和学习编排能力。

优先级判断如下：

1. 先做学习域 schema 和 API
2. 再做 study dashboard
3. 再把苏格拉底 Agent 接入诊断和画像更新

只有这样，系统才能从“会聊天”进化成“会辅导、会诊断、会调计划”的考研数学产品。
