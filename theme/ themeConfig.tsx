import type { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
    token: {
        colorPrimary: '#51459e',
        colorLink: '#475467',
        colorLinkHover: '#1c2539',
        colorLinkActive: '#848484',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#f5222d',
        fontSize: 16,
        fontFamily: `Prompt, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
        colorTextBase: '#000000',
        colorTextSecondary: '#000000a8',
        colorTextDisabled: 'rgb(153, 153, 153)',
        colorPrimaryBorder: '#d9d9d9',
        borderRadius: 8,
        boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    },
    components: {
        Button: {
            algorithm: true,
            controlHeight: 32,
            colorPrimary: '#51459e',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            paddingBlock: 0,
            paddingInline: 8,
        },
        // Input: {
        //   algorithm: true,
        //   borderRadius: 8,
        //   controlHeight: 48,
        // },
        Modal: {
            borderRadius: 12,
        },
    },
}

export default theme
