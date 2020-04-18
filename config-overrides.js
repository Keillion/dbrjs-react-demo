const { override, fixBabelImports, addLessLoader } = require('customize-cra');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

process.env.GENERATE_SOURCEMAP = "false";

const addCustom = () => config => {
    let plugins = [/* new BundleAnalyzerPlugin(),*/new CompressionPlugin()];
    let externals = {
        'antd': 'antd'
    }
    config.plugins = [...config.plugins, ...plugins];
    config.externals = externals;
    //ref:https://github.com/Beven91/webpack-ant-icon-loader
    config.module.rules.push({
        loader: 'webpack-ant-icon-loader',
        enforce: 'pre',
        include: [
            require.resolve('@ant-design/icons/lib/dist')
        ]
    });
    config.optimization.splitChunks.chunks = chunk => {
        return chunk.name !== 'antd-icons';
    }
    // config.resolve.alias = {...config.resolve.alias, '@ant-design/icons/lib/dist$': 'src/icons.js'};
    console.log(config);
    return config;
}

module.exports = {
    webpack: override(
        addCustom(),
        fixBabelImports('import', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true,
        }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#FE8E14' },
        }),
    )
}