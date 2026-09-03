import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Bold,
    Heading2,
    Heading3,
    ImageUp,
    Italic,
    List,
    ListOrdered,
    Loader2,
    Quote,
    Redo2,
    Strikethrough,
    Undo2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Photo } from '@/types';

function getMarkdown(editor: Editor): string {
    return (editor.storage as unknown as { markdown: { getMarkdown(): string } }).markdown.getMarkdown();
}

type BlockType = 'paragraph' | 'h2' | 'h3';

function currentBlockType(editor: Editor): BlockType {
    if (editor.isActive('heading', { level: 2 })) return 'h2';
    if (editor.isActive('heading', { level: 3 })) return 'h3';
    return 'paragraph';
}

export default function MarkdownEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (markdown: string) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [, forceRerender] = useState(0);

    const editor = useEditor({
        extensions: [StarterKit, Image, Markdown],
        content: value,
        onUpdate: ({ editor }) => onChange(getMarkdown(editor)),
        onSelectionUpdate: () => forceRerender((n) => n + 1),
        onTransaction: () => forceRerender((n) => n + 1),
        editorProps: {
            attributes: {
                class: 'prose prose-neutral dark:prose-invert max-w-none min-h-[320px] px-4 py-3 focus:outline-none',
            },
        },
    });

    useEffect(() => {
        if (editor && value !== getMarkdown(editor)) {
            editor.commands.setContent(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editor]);

    async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || !editor) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const { data } = await axios.post<{ photo: Photo }>(route('admin.photos.upload'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const url = data.photo.medium_url ?? data.photo.full_url;

            if (!url) {
                toast.error('Upload succeeded but the server returned no image URL — check disk/storage config.');
                return;
            }

            editor.chain().focus().setImage({ src: url }).run();
            toast.success('Đã chèn ảnh');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    const serverMessage =
                        (error.response.data as { message?: string; errors?: Record<string, string[]> })?.message ??
                        Object.values((error.response.data as { errors?: Record<string, string[]> })?.errors ?? {})
                            .flat()
                            .join(' ');
                    toast.error(`Upload thất bại (${error.response.status}): ${serverMessage || 'lỗi không rõ'}`);
                } else {
                    toast.error(`Upload thất bại: không kết nối được tới server (${error.message}).`);
                }
            } else {
                toast.error(`Upload thất bại: ${error instanceof Error ? error.message : 'lỗi không xác định'}`);
            }
            // eslint-disable-next-line no-console
            console.error('Image upload failed', error);
        } finally {
            setUploading(false);
        }
    }

    if (!editor) return null;

    function setBlockType(type: BlockType) {
        if (!editor) return;

        const chain = editor.chain().focus();
        if (type === 'paragraph') chain.setParagraph().run();
        else if (type === 'h2') chain.toggleHeading({ level: 2 }).run();
        else chain.toggleHeading({ level: 3 }).run();
    }

    return (
        <TooltipProvider>
            <div className="overflow-hidden rounded-md border border-input bg-background">
                <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
                    <Select value={currentBlockType(editor)} onValueChange={(v) => setBlockType(v as BlockType)}>
                        <SelectTrigger size="sm" className="w-[130px] border-none bg-transparent shadow-none">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paragraph">Đoạn văn</SelectItem>
                            <SelectItem value="h2">Tiêu đề 2</SelectItem>
                            <SelectItem value="h3">Tiêu đề 3</SelectItem>
                        </SelectContent>
                    </Select>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ToolbarToggle
                        label="Đậm"
                        pressed={editor.isActive('bold')}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    >
                        <Bold />
                    </ToolbarToggle>
                    <ToolbarToggle
                        label="Nghiêng"
                        pressed={editor.isActive('italic')}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <Italic />
                    </ToolbarToggle>
                    <ToolbarToggle
                        label="Gạch ngang"
                        pressed={editor.isActive('strike')}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough />
                    </ToolbarToggle>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ToolbarToggle
                        label="Tiêu đề 2"
                        pressed={editor.isActive('heading', { level: 2 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                        <Heading2 />
                    </ToolbarToggle>
                    <ToolbarToggle
                        label="Tiêu đề 3"
                        pressed={editor.isActive('heading', { level: 3 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    >
                        <Heading3 />
                    </ToolbarToggle>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ToolbarToggle
                        label="Danh sách"
                        pressed={editor.isActive('bulletList')}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <List />
                    </ToolbarToggle>
                    <ToolbarToggle
                        label="Danh sách số"
                        pressed={editor.isActive('orderedList')}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrdered />
                    </ToolbarToggle>
                    <ToolbarToggle
                        label="Trích dẫn"
                        pressed={editor.isActive('blockquote')}
                        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        <Quote />
                    </ToolbarToggle>

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <Tooltip>
                        <TooltipTrigger
                            render={
                                <Toggle
                                    size="sm"
                                    pressed={false}
                                    disabled={uploading}
                                    onPressedChange={() => fileInputRef.current?.click()}
                                    aria-label="Chèn ảnh"
                                >
                                    {uploading ? <Loader2 className="animate-spin" /> : <ImageUp />}
                                </Toggle>
                            }
                        />
                        <TooltipContent>Chèn ảnh</TooltipContent>
                    </Tooltip>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileSelected}
                    />

                    <Separator orientation="vertical" className="mx-1 h-6" />

                    <ToolbarToggle
                        label="Hoàn tác"
                        pressed={false}
                        onPressedChange={() => editor.chain().focus().undo().run()}
                    >
                        <Undo2 />
                    </ToolbarToggle>
                    <ToolbarToggle
                        label="Làm lại"
                        pressed={false}
                        onPressedChange={() => editor.chain().focus().redo().run()}
                    >
                        <Redo2 />
                    </ToolbarToggle>
                </div>

                <EditorContent editor={editor} className="max-h-[70vh] overflow-y-auto" />
            </div>
        </TooltipProvider>
    );
}

function ToolbarToggle({
    label,
    pressed,
    onPressedChange,
    children,
}: {
    label: string;
    pressed: boolean;
    onPressedChange: () => void;
    children: React.ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Toggle size="sm" pressed={pressed} onPressedChange={onPressedChange} aria-label={label}>
                        {children}
                    </Toggle>
                }
            />
            <TooltipContent>{label}</TooltipContent>
        </Tooltip>
    );
}
