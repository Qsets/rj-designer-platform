// 邀请码生成和管理工具

interface InviteCode {
  code: string;
  type: 'designer' | 'client' | 'admin';
  expiresAt: string;
  usedAt?: string;
  usedBy?: string;
  createdAt: string;
  maxUses: number;
  currentUses: number;
  description?: string;
}

// 生成随机邀请码
export const generateInviteCode = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 生成批量邀请码
export const generateBatchInviteCodes = (
  count: number,
  type: 'designer' | 'client' | 'admin' = 'client',
  expiryDays: number = 30,
  maxUses: number = 1
): InviteCode[] => {
  const codes: InviteCode[] = [];
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    codes.push({
      code: generateInviteCode(),
      type,
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString(),
      maxUses,
      currentUses: 0,
      description: `批量生成的${type}邀请码`
    });
  }

  return codes;
};

// 验证邀请码
export const validateInviteCode = (code: string, codes: InviteCode[]): {
  valid: boolean;
  message: string;
  codeData?: InviteCode;
} => {
  const inviteCode = codes.find(c => c.code === code);
  
  if (!inviteCode) {
    return { valid: false, message: '邀请码不存在' };
  }

  if (new Date() > new Date(inviteCode.expiresAt)) {
    return { valid: false, message: '邀请码已过期' };
  }

  if (inviteCode.currentUses >= inviteCode.maxUses) {
    return { valid: false, message: '邀请码使用次数已达上限' };
  }

  return { valid: true, message: '邀请码有效', codeData: inviteCode };
};

// 使用邀请码
export const useInviteCode = (code: string, userId: string, codes: InviteCode[]): boolean => {
  const validation = validateInviteCode(code, codes);
  
  if (!validation.valid || !validation.codeData) {
    return false;
  }

  validation.codeData.currentUses += 1;
  if (validation.codeData.currentUses === 1) {
    validation.codeData.usedAt = new Date().toISOString();
    validation.codeData.usedBy = userId;
  }

  return true;
};

// 预生成的10个邀请码供用户注册使用
export const getPreGeneratedInviteCodes = (): InviteCode[] => {
  return [
    {
      code: 'DESIGN01',
      type: 'designer',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90天后过期
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '设计师专用邀请码 - 享受首月免费服务'
    },
    {
      code: 'CLIENT01',
      type: 'client',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '客户专用邀请码 - 首次发布项目享受优惠'
    },
    {
      code: 'PREMIUM1',
      type: 'designer',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '高级设计师邀请码 - 直接获得认证设计师身份'
    },
    {
      code: 'STARTUP1',
      type: 'client',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '创业公司邀请码 - 享受企业级服务折扣'
    },
    {
      code: 'CREATIVE',
      type: 'designer',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '创意设计师邀请码 - 获得作品集展示推荐位'
    },
    {
      code: 'BUSINESS',
      type: 'client',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '商业客户邀请码 - 专属客户经理服务'
    },
    {
      code: 'ARTIST01',
      type: 'designer',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '艺术家邀请码 - 参与平台艺术项目优先权'
    },
    {
      code: 'BRAND001',
      type: 'client',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '品牌方邀请码 - 品牌设计项目专属通道'
    },
    {
      code: 'STUDIO01',
      type: 'designer',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '设计工作室邀请码 - 团队协作功能免费试用'
    },
    {
      code: 'PARTNER1',
      type: 'client',
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      maxUses: 1,
      currentUses: 0,
      description: '合作伙伴邀请码 - 长期合作优惠政策'
    }
  ];
};

// 格式化邀请码信息
export const formatInviteCodeInfo = (code: InviteCode): string => {
  const typeNames = {
    designer: '设计师',
    client: '客户',
    admin: '管理员'
  };
  
  const expiryDate = new Date(code.expiresAt).toLocaleDateString('zh-CN');
  const isExpired = new Date() > new Date(code.expiresAt);
  const isUsed = code.currentUses >= code.maxUses;
  
  let status = '可用';
  if (isExpired) status = '已过期';
  else if (isUsed) status = '已使用';
  
  return `邀请码: ${code.code}
类型: ${typeNames[code.type]}
状态: ${status}
过期时间: ${expiryDate}
使用次数: ${code.currentUses}/${code.maxUses}
描述: ${code.description || '无'}`;
};

// 导出所有邀请码信息（用于展示给用户）
export const exportInviteCodesInfo = (): string => {
  const codes = getPreGeneratedInviteCodes();
  const header = `=== 设计师交易平台邀请码 ===
生成时间: ${new Date().toLocaleString('zh-CN')}
总数量: ${codes.length}个
有效期: 90天

`;

  const codesList = codes.map((code, index) => 
    `${index + 1}. ${formatInviteCodeInfo(code)}`
  ).join('\n\n');

  const footer = `

=== 使用说明 ===
1. 每个邀请码只能使用一次
2. 请在有效期内使用
3. 不同类型的邀请码享受不同权益
4. 如有问题请联系客服

=== 注册流程 ===
1. 访问平台注册页面
2. 输入邀请码
3. 填写个人信息
4. 完成邮箱验证
5. 开始使用平台服务`;

  return header + codesList + footer;
};

export default {
  generateInviteCode,
  generateBatchInviteCodes,
  validateInviteCode,
  useInviteCode,
  getPreGeneratedInviteCodes,
  formatInviteCodeInfo,
  exportInviteCodesInfo
};