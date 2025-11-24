#!/bin/bash

# Script to remove emojis from markdown documentation files

# Common emoji patterns to remove
EMOJIS=(
    "✅" "❌" "⚠️" "🚀" "📋" "🔒" "💡" "🎯" "📊" "🔧" "📦" "📝"
    "🔐" "📍" "🎉" "🔍" "📥" "📤" "🔄" "⚙️" "🔨" "📚" "🔑"
    "🌐" "🧪" "📄" "🔗" "🛠️" "📈" "🔄" "💾" "🔍" "📱" "🌍"
    "🔴" "🟡" "🟢" "⚡" "🎨" "🔔" "📞" "💼" "🏢" "📦" "🎁"
)

# Files to process (excluding node_modules and dist)
find . -name "*.md" -type f \
    ! -path "./node_modules/*" \
    ! -path "./frontend/node_modules/*" \
    ! -path "./qr-generator/node_modules/*" \
    ! -path "./frontend/dist/*" \
    ! -path "./.git/*" | while read file; do
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Remove emojis
    sed -i '' \
        -e 's/✅//g' \
        -e 's/❌//g' \
        -e 's/⚠️//g' \
        -e 's/🚀//g' \
        -e 's/📋//g' \
        -e 's/🔒//g' \
        -e 's/💡//g' \
        -e 's/🎯//g' \
        -e 's/📊//g' \
        -e 's/🔧//g' \
        -e 's/📦//g' \
        -e 's/📝//g' \
        -e 's/🔐//g' \
        -e 's/📍//g' \
        -e 's/🎉//g' \
        -e 's/🔍//g' \
        -e 's/📥//g' \
        -e 's/📤//g' \
        -e 's/🔄//g' \
        -e 's/⚙️//g' \
        -e 's/🔨//g' \
        -e 's/📚//g' \
        -e 's/🔑//g' \
        -e 's/🌐//g' \
        -e 's/🧪//g' \
        -e 's/📄//g' \
        -e 's/🔗//g' \
        -e 's/🛠️//g' \
        -e 's/📈//g' \
        -e 's/💾//g' \
        -e 's/📱//g' \
        -e 's/🌍//g' \
        -e 's/🔴//g' \
        -e 's/🟡//g' \
        -e 's/🟢//g' \
        -e 's/⚡//g' \
        -e 's/🎨//g' \
        -e 's/🔔//g' \
        -e 's/📞//g' \
        -e 's/💼//g' \
        -e 's/🏢//g' \
        -e 's/🎁//g' \
        "$file"
    
    # Clean up empty status markers (like "**NOT PRODUCTION READY**" after removing emoji)
    sed -i '' \
        -e 's/\*\*NOT PRODUCTION READY\*\*/\*\*NOT PRODUCTION READY\*\*/g' \
        -e 's/\*\*PRODUCTION READY\*\*/\*\*PRODUCTION READY\*\*/g' \
        "$file"
    
    echo "Processed: $file"
done

echo ""
echo "Done! Backup files created with .bak extension"
echo "Review changes and remove .bak files if satisfied"




