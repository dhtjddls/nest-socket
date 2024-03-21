chmod +x organize_spec.sh

spec_files=$( find . -name "*.spec.ts" )
for file in $spec_files
do
    mv "$file" test
done
