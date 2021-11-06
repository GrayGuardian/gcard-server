@echo off

cd %cd%

set pbjs=../../node_modules/protobufjs/bin/pbjs
set protocol_dir=%cd%\
set json_pb_dir=../../common/pb/data/
set lua_pb_dir=D:\testtttt\Assets\AssetBundles\pb\

for /R %protocol_dir% %%f in (*.proto) do (
	echo Json PB === %json_pb_dir%%%~nf_pb.json
	node %pbjs% %%f > %json_pb_dir%%%~nf_pb.json

	echo Lua PB === %lua_pb_dir%%%~nf_pb.bytes
	protoc -o %%~nf_pb.bytes %%~nf.proto
	move %cd%\%%~nf_pb.bytes %lua_pb_dir%%%~nf_pb.bytes
)



pause