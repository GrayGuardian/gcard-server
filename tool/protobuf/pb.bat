@echo off

cd %cd%

set pbjs=../../node_modules/protobufjs/bin/pbjs
set lua_plugin_dir=%cd%\plugins\protobuf-lua\
set protocol_dir=%cd%\protocol\
set json_pb_dir=../../common/pb/
set lua_pb_dir=../../../gcard-client/Assets/Resources/AssetBundles/lua/pb/

for /R %protocol_dir% %%f in (*.proto) do (
	echo Json PB === %json_pb_dir%%%~nf_pb.json
	node %pbjs% %%f > %json_pb_dir%%%~nf_pb.json
	echo Lua PB === %lua_pb_dir%%%~nf_pb.lua
	%lua_plugin_dir%protoc.exe --plugin=protoc-gen-lua="%lua_plugin_dir%plugin\protoc-gen-lua5_3.bat" --lua_out=%lua_pb_dir% -I %protocol_dir% %%f
)



pause