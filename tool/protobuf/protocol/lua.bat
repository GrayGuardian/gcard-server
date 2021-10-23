@echo off
for /R %cd% %%f in (*.proto) do (
	echo %%~nf
	protoc -o %%~nf_pb.bytes %%~nf.proto
)

pause
