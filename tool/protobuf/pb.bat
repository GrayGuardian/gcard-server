@echo off

cd %cd%

set pbjs=../../node_modules/protobufjs/bin/pbjs
set protocol_dir=%cd%\protocol\
set json_pb_dir=../../common/pb/

for /R %protocol_dir% %%f in (*.proto) do ( 
	echo Json PB === %json_pb_dir%%%~nf_pb.json
	node %pbjs% %%f > %json_pb_dir%%%~nf_pb.json
)



pause