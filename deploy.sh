#!/bin/bash
# ============================================================
#  deploy.sh — Deploy dengan backup otomatis sebelum git pull
#  Jalankan di server: bash deploy.sh [branch]
#  Contoh: bash deploy.sh main
#          bash deploy.sh feature/quick-filter-category-data
# ============================================================

set -e

DEPLOY_DIR="/www/wwwroot/admin.octolink.id"
BACKUP_DIR="$DEPLOY_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BRANCH="${1:-main}"

# ── Warna output ──────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}  Deploy ke: $DEPLOY_DIR${NC}"
echo -e "${CYAN}  Branch   : $BRANCH${NC}"
echo -e "${CYAN}  Backup   : $BACKUP_DIR${NC}"
echo -e "${CYAN}============================================${NC}"

# ── Pastikan di direktori yang benar ─────────────────────────
cd "$DEPLOY_DIR" || { echo -e "${RED}❌ Direktori $DEPLOY_DIR tidak ditemukan${NC}"; exit 1; }

# ── Buat folder backup ────────────────────────────────────────
mkdir -p "$BACKUP_DIR"

# ── Backup semua file HTML yang ada ──────────────────────────
echo -e "\n${YELLOW}📦 Membuat backup...${NC}"
BACKED_UP=0
for file in data.html admin.html client.html report.html status.html add.html; do
    if [ -f "$DEPLOY_DIR/$file" ]; then
        BACKUP_NAME="${file%.html}_$TIMESTAMP.html"
        cp "$DEPLOY_DIR/$file" "$BACKUP_DIR/$BACKUP_NAME"
        echo -e "  ${GREEN}✅ $file  →  backups/$BACKUP_NAME${NC}"
        BACKED_UP=$((BACKED_UP + 1))
    fi
done
echo -e "  ${GREEN}Total $BACKED_UP file dibackup.${NC}"

# ── Bersihkan backup lama (simpan 10 versi terakhir per file) ─
echo -e "\n${YELLOW}🧹 Membersihkan backup lama (simpan 10 terbaru per file)...${NC}"
for file in data admin client report status add; do
    # list backup file dari terlama, hapus jika lebih dari 10
    COUNT=$(ls -1 "$BACKUP_DIR/${file}_"*.html 2>/dev/null | wc -l)
    if [ "$COUNT" -gt 10 ]; then
        TO_DELETE=$((COUNT - 10))
        ls -1t "$BACKUP_DIR/${file}_"*.html | tail -n "$TO_DELETE" | while read -r old_file; do
            rm -f "$old_file"
            echo -e "  🗑️  Dihapus: $(basename $old_file)"
        done
    fi
done

# ── Git pull ──────────────────────────────────────────────────
echo -e "\n${YELLOW}📥 Menjalankan git pull...${NC}"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}  ✅ Deploy selesai! ($(date '+%Y-%m-%d %H:%M:%S'))${NC}"
echo -e "${GREEN}============================================${NC}"

# ── Tampilkan daftar backup terbaru ──────────────────────────
echo -e "\n${CYAN}📂 Backup terbaru:${NC}"
ls -lt "$BACKUP_DIR"/*.html 2>/dev/null | head -10 | awk '{print "  "$NF}' | sed "s|$BACKUP_DIR/||"
