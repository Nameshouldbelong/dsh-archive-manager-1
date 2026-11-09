// 同代宿主的依赖范围允许后续版本；隔离验收固定传递依赖，避免宿主混版。
// 只覆盖仍支持的 0.2.x。0.1.x 已退出 peer。

// 支持范围：0.2.x 的全部 RC + 最新一个 alpha；中间的 alpha 不纳入支持矩阵。
export const hostProfiles = [
	{ version: "0.2.0-rc.1", cordis: "4.0.4", schemastery: "3.18.4", latest: true },
	{ version: "0.2.0-rc.2", cordis: "4.0.4", schemastery: "3.18.4", latest: true },
	{ version: "0.2.1-rc.1", cordis: "4.0.5", schemastery: "3.18.5", latest: true },
	{ version: "0.2.1-rc.2", cordis: "4.0.5", schemastery: "3.18.5", latest: true },
	{ version: "0.2.1-rc.3", cordis: "4.0.5", schemastery: "3.18.5", latest: true },
	{ version: "0.2.1-rc.4", cordis: "4.0.5", schemastery: "3.18.5", latest: true },
	{ version: "0.2.1-rc.5", cordis: "4.0.5", schemastery: "3.18.5", latest: true },
	{ version: "0.2.2-rc.1", cordis: "4.1.0", schemastery: "3.19.0", latest: true },
];

export const cordisPlugins = {
	"4.0.4": {
		"@deepseek-ai/cordis-plugin-group": "1.0.4",
		"@deepseek-ai/cordis-plugin-hmr": "1.0.19",
		"@deepseek-ai/cordis-plugin-include": "1.0.9",
		"@deepseek-ai/cordis-plugin-loader": "1.0.5",
		"@deepseek-ai/cordis-plugin-timer": "1.1.6",
	},
	"4.0.5": {
		"@deepseek-ai/cordis-plugin-group": "1.0.5",
		"@deepseek-ai/cordis-plugin-hmr": "1.0.20",
		"@deepseek-ai/cordis-plugin-include": "1.0.10",
		"@deepseek-ai/cordis-plugin-loader": "1.0.6",
		"@deepseek-ai/cordis-plugin-timer": "1.1.7",
	},
	"4.1.0": {
		"@deepseek-ai/cordis-plugin-group": "1.1.0",
		"@deepseek-ai/cordis-plugin-hmr": "1.1.0",
		"@deepseek-ai/cordis-plugin-include": "1.1.0",
		"@deepseek-ai/cordis-plugin-loader": "1.1.0",
		"@deepseek-ai/cordis-plugin-timer": "1.2.0",
	},
	"4.0.6-alpha.1": {
		"@deepseek-ai/cordis-plugin-group": "1.0.6-alpha.1",
		"@deepseek-ai/cordis-plugin-hmr": "1.0.21-alpha.1",
		"@deepseek-ai/cordis-plugin-include": "1.0.11-alpha.1",
		"@deepseek-ai/cordis-plugin-loader": "1.0.7-alpha.1",
		"@deepseek-ai/cordis-plugin-timer": "1.1.8-alpha.1",
	},
	"4.0.6-alpha.2": {
		"@deepseek-ai/cordis-plugin-group": "1.0.6-alpha.2",
		"@deepseek-ai/cordis-plugin-hmr": "1.0.21-alpha.2",
		"@deepseek-ai/cordis-plugin-include": "1.0.11-alpha.2",
		"@deepseek-ai/cordis-plugin-loader": "1.0.7-alpha.2",
		"@deepseek-ai/cordis-plugin-timer": "1.1.8-alpha.2",
	},
};

for (const generation of [1, 2]) {
	cordisPlugins[`4.0.5-alpha.${generation}`] = Object.fromEntries(Object.entries(cordisPlugins["4.0.5"]).map(([name, version]) => [name, `${version}-alpha.${generation}`]));
}

export function getHostProfile(version) {
	const profile = hostProfiles.find((p) => p.version === version);
	if (!profile) {
		throw new Error(`未找到宿主版本 ${version} 的兼容矩阵配置`);
	}
	return profile;
}

export function getCordisPlugins(cordisVersion) {
	const plugins = cordisPlugins[cordisVersion];
	if (!plugins) {
		throw new Error(`未找到 Cordis ${cordisVersion} 对应的插件映射`);
	}
	return plugins;
}

export function hostTestOverrides(version) {
	const supported = hostProfiles.map((p) => p.version);
	if (!supported.includes(version)) return {};
	const names = [
		"agent", "api-gateway", "brand", "client-connection", "client-locale", "client-store",
		"client-ui-conversation", "client-ui-primitives", "client-ui-sidebar", "client-ui-slots", "client-ui-workspace",
		"code-runtime", "compaction", "credentials", "deque", "host-webserver",
		...(version.startsWith("0.2.0-") ? ["invariants"] : []),
		"llm",
		"sandbox", "sandbox-policy", "scope", "session",
		"session-format", "session-format-catalog", "session-format-v0-to-v1", "session-format-v1-to-v2", "session-format-v2-to-v3",
		"session-format-v3-to-v4",
		"session-persistence", "session-persistence-jsonl", "session-projection", "session-projection-cache", "session-query", "session-title",
		"spill", "spill-local", "storage", "storage-domain", "system-prompt", "timeout", "tool-todo", "tools",
		"typert-protocol", "typert-registry", "user-approval", "util-crypto", "util-values", "workspace",
		"compaction-image-offload", "ptc-runtime",
		"client-shortcuts", "client-product-analytics"
	];
	return Object.fromEntries(names.map((name) => [`@deepseek-ai/dsh-${name}`, version]));
}
